document.addEventListener('DOMContentLoaded', function () {
    fetchJobs();

    const form = document.getElementById('ttsForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const jobName = document.getElementById('job_name').value;
        const description = document.getElementById('description').value;

        fetch(`TTS/tts_create_job/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                job_name: jobName,
                description: description
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    alert('Job successfully created!');
                    fetchJobs();
                    form.reset();
                } else {
                    alert('Error: data creation failed');
                }
            })
            .catch(error => console.error('Error: Network error'));
    })
});

function fetchJobs() {
    fetch(`/TTS/tts_jobs/`)
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <td id="download-link-${job.id}">${job.file_location ? `<a href="${job.file_location}" download>Download</a>` : 'N/A'}</td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <td id="status-${job.id}">${job.status}</td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <td id="audio-player-${job.id}">${job.file_location && job.status === 'DONE' ?
                        `<audio controls><source src="${job.audio_file}" type="audio/mp3">Your browser does not support the audio element.</audio>`
                        : 'N/A'}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <button onclick="delete_job(${job.id})">Delete</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <button onclick="gen_tts(${job.id})">Process</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function delete_job(jobId) {
    if (confirm("Are you sure you want to delete this job?")) {
        fetch(`TTS/tts_delete_job/${jobId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                fetchJobs();
            })
    }
}

function gen_tts(jobId) {
    fetch(`TTS/tts/${jobId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById(`status-${jobId}`).innerText = 'DONE';
                document.getElementById(`file-location-${jobId}`).innerText = data.file_location;
                document.getElementById(`download-link-${jobId}`).innerHTML = `<a href="${data.file_location}" download>Download</a>`;
                const audio_player = document.getElementById(`audio-player-${jobId}`).innerHTML = `<audio controls><source src="${data.file_location}" type="audio/mp3"> Your browser does not support audio element.</audio>`;
                audio_player.src = data.file_location;
            } else {
                alert(`Error processing TTS: ${data.message}`);
            }
        })
        .catch(error => console.error("Error generating TTS:", error));
}