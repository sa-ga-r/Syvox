document.addEventListener('DOMContentLoaded', function () {
    fetchJobs();

    const form = document.getElementById('ttsForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const jobName = document.getElementById('job_name').value;
        const description = document.getElementById('description').value;

        fetch('/create_job/', {
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
                alert('Error1: data creation failed');
            }
        })
        .catch(error => console.error('Error2: Network error'));
    })
});

function fetchJobs() {
    fetch('/jobs/')
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
                    <td>${job.file_location || 'N/A'}</td>
                    <td>${job.download_link ? `<a href="${job.download_link}" download>Download</a>` : 'N/A'}</td>
                    <td>${job.status}</td>
                    <td>
                        ${job.download_link && job.status === 'DONE' ? 
                        `<audio controls><source src="${job.download_link}" type="audio/mp3">Your browser does not support the audio element.</audio>` 
                        : 'N/A'}
                    </td>
                    <td><button onclick="delete_job(job.id)">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function delete_job(jobId) {
    console.log(`/delete_job/${jobId}/`)
    fetch(`/delete_job/${jobId}/`, {
        method : 'DELETE',
        headers : {
            'Content-Type':'application/json',
        }
    })
    .then(response => {
        fetchJobs();
    })
}