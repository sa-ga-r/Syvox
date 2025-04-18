document.addEventListener('DOMContentLoaded', function () {
    fetchJobs();
});

function fetchJobs() {
    fetch('/tts_fetch_jobs/')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('jobsTableBody');
            tableBody.innerHTML = '';

            data.jobs.forEach((job, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                                                                                                                    <td>${index + 1}</td>
                                                                                                                                        <td>${job.job_name}</td>
                                                                                                                                                            <td>${job.description.substring(0, 20)}...</td>
                                                                                                                                                                                <td>${job.created_date}</td>
                                                                                                                                                                                                    <td id="file-location-${job.id}">${job.file_location || 'N/A'}</td>
                                                                                                                                                                                                                        <td id="download-link-${job.id}">${job.download_link ? `<a href="${job.download_link}" download>Download</a>` : 'N/A'}</td>
                                                                                                                                                                                                                                            <td id="status-${job.id}">${job.status}</td>
                                                                                                                                                                                                                                                                <td id="preview-${job.id}">${job.download_link ? `<a href="${job.download_link}" target="_blank">Open</a>` : 'N/A'}</td>
                                                                                                                                                                                                                                                                                    <td>
                                                                                                                                                                                                                                                                                                            <button onclick="delete_job(${job.id})">Delete</button>
                                                                                                                                                                                                                                                                                                                                    <button onclick="gen_stt(${job.id})">Process</button>
                                                                                                                                                                                                                                                                                                                                                        </td>
                                                                                                                                                                                                                                                                                                                                                                        `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function delete_job(jobId) {
    fetch(`/tts_delete_job/${jobId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(() => fetchJobs());
}

function gen_stt(jobId) {
    fetch(`/gen_tts/${jobId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById(`status-${jobId}`).innerText = 'DONE';
                document.getElementById(`download-link-${jobId}`).innerHTML = `<a href="${data.download_url}" download>Download</a>`;
                document.getElementById(`preview-${jobId}`).innerHTML = `<div class="preview-text">${data.preview}</div>`;
                fetchJobs();
            } else {
                alert(`Error processing STT: ${data.message}`);
            }
        })
        .catch(error => console.error("Error generating STT:", error));
}