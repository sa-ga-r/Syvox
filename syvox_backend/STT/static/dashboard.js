let sttJobsData = [];
let ttsJobsData = [];

document.addEventListener('DOMContentLoaded', function () {
    fetchAllJobs();
});

function fetchAllJobs() {
    Promise.all([
        fetch('STT/stt_jobs/').then(res => res.json()),
        fetch('TTS/tts_jobs/').then(res => res.json())
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
        ...sttJobsData.map(job => ({ ...job, type: 'STT' })),
        ...ttsJobsData.map(job => ({ ...job, type: 'TTS' }))
    ];

    if (allJobs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10">No jobs found.</td></tr>';
        return;
    }

    allJobs.forEach((job, index) => {
        const fileName = job.file_location?.split('/').pop() || 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
                                                                                                                                                                                        <td>${index + 1}</td>
                                                                                                                                                                                                    <td>${job.type}</td>
                                                                                                                                                                                                                <td>${job.job_name || 'N/A'}</td>
                                                                                                                                                                                                                            <td>${job.description?.substring(0, 30) || 'N/A'}...</td>
                                                                                                                                                                                                                                        <td>${job.created_date || 'N/A'}</td>
                                                                                                                                                                                                                                                    <td>${fileName}</td>
                                                                                                                                                                                                                                                                <td>${job.download_link ? `<a href="${job.download_link}" download>Download</a>` : 'N/A'}</td>
                                                                                                                                                                                                                                                                            <td>${job.status || 'N/A'}</td>
                                                                                                                                                                                                                                                                                        <td>${job.download_link ? `<a href="${job.download_link}" target="_blank">Open</a>` : 'N/A'}</td>
                                                                                                                                                                                                                                                                                                    <td>
                                                                                                                                                                                                                                                                                                                    <button onclick="${job.type === 'STT' ? `gen_stt(${job.id})` : `gen_tts(${job.id})`}">Process</button>
                                                                                                                                                                                                                                                                                                                                    <button onclick="${job.type === 'STT' ? `delete_stt(${job.id})` : `delete_tts(${job.id})`}">Delete</button>
                                                                                                                                                                                                                                                                                                                                                </td>
                                                                                                                                                                                                                                                                                                                                                        `;
        tableBody.appendChild(row);
    });
}

function delete_stt(jobId) {
    fetch(`/STT/stt_delete_job/${jobId}/`, { method: 'DELETE' })
        .then(() => fetchAllJobs());
}

function gen_stt(jobId) {
    fetch(`/STT/gen_stt/${jobId}/`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            alert(data.status === 'success' ? 'STT processing done!' : `Error: ${data.message}`);
            fetchAllJobs();
        });
}

function delete_tts(jobId) {
    fetch(`/TTS/tts_delete_job/${jobId}/`, { method: 'DELETE' })
        .then(() => fetchAllJobs());
}

function gen_tts(jobId) {
    fetch(`/TTS/tts/${jobId}/`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            alert(data.status === 'success' ? 'TTS processing done!' : `Error: ${data.message}`);
            fetchAllJobs();
        });
}