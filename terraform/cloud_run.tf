resource "google_project_service" "run" {
  service = "run.googleapis.com"
}

resource "google_cloud_run_service" "rss-service" {
  name     = "rss-service"
  location = var.region

  template {
    spec {
      containers {
        # image = "gcr.io/google-samples/hello-app:2.0"
        image = "gcr.io/${var.project_name}/main_server:latest"
      }
      timeout_seconds = 50

    }

    metadata {

    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }



  depends_on = [google_project_service.run]
}


output "url" {
  value = google_cloud_run_service.rss-service.status[0].url
}

output "latest_created_revision_name" {
  value = google_cloud_run_service.rss-service.status[0].latest_created_revision_name
}

output "latest_ready_revision_name" {
  value = google_cloud_run_service.rss-service.status[0].latest_ready_revision_name
}
