let sttJobsData = [];
let ttsJobsData = [];

document.addEventListener('DOMContentLoaded', function () {
    fetchAllJobs();
});

function fetchAllJobs() {
    Promise.all([
        fetch('/stt_jobs/').then(res => res.json()),
        fetch('/tts_jobs/').then(res => res.json())
    ])
        .then(([sttData, ttsData]) => {
            sttJobsData = sttData.jobs || [];
            ttsJobsData = ttsData.jobs || [];
            renderTable();
        })
        .catch(error => console.error('Error fetching jobs:', error));
}

function renderTable() {
    const tableBody = document.getElementById('jobsTableBody');
    tableBody.innerHTML = '';

    const allJobs = [
        ...sttJobsData.map(job => ({ ...job, source: 'STT' })),
        ...ttsJobsData.map(job => ({ ...job, source: 'TTS' }))
    ];

    if (allJobs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10">No jobs found.</td></tr>';
        return;
    }

    allJobs.forEach((job, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                                                                                                                                                        <td>${index + 1}</td>
                                                                                                                                                                    <td>${job.source}</td>
                                                                                                                                                                                <td>${job.job_name}</td>
                                                                                                                                                                                            <td>${job.description?.substring(0, 20) || 'N/A'}...</td>
                                                                                                                                                                                                        <td>${job.created_date || 'N/A'}</td>
                                                                                                                                                                                                                    <td>${job.file_location || 'N/A'}</td>
                                                                                                                                                                                                                                <td>${job.download_link ? `<a href="${job.download_link}" download>Download</a>` : 'N/A'}</td>
                                                                                                                                                                                                                                            <td>${job.status || 'N/A'}</td>
                                                                                                                                                                                                                                                        <td>${job.download_link ? `<a href="${job.download_link}" target="_blank">Open</a>` : 'N/A'}</td>
                                                                                                                                                                                                                                                                    <td>
                                                                                                                                                                                                                                                                                    ${job.source === 'STT' ? `
                                                                                                                                                                                                                                                                                                        <button onclick="delete_job(${job.id})">Delete</button>
                                                                                                                                                                                                                                                                                                                            <button onclick="gen_stt(${job.id})">Process</button>
                                                                                                                                                                                                                                                                                                                                            ` : 'N/A'}
                                                                                                                                                                                                                                                                                                                                                        </td>
                                                                                                                                                                                                                                                                                                                                                                `;
        tableBody.appendChild(row);
    });
}

function delete_job(jobId) {
    fetch(`/stt_delete_job/${jobId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(() => fetchAllJobs());
}

function gen_stt(jobId) {
    fetch(`/gen_stt/${jobId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("STT processing completed!");
                fetchAllJobs();
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => console.error("Error generating STT:", error));
}