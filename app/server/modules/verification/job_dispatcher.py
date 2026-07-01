from redis_queue import get_manual_ingestion_queue
from modules.verification.orchestrator import JobDispatcher
from worker import run_manual_ingestion_job


class RQJobDispatcher(JobDispatcher):
    def enqueue_manual_ingestion(self, verification_job_id: int) -> str:
        from rq.job import Job

        queue = get_manual_ingestion_queue()
        job: Job = queue.enqueue(run_manual_ingestion_job, verification_job_id)
        return job.id


class InlineJobDispatcher(JobDispatcher):
    def enqueue_manual_ingestion(self, verification_job_id: int) -> str:
        run_manual_ingestion_job(verification_job_id)
        return f"inline-{verification_job_id}"
