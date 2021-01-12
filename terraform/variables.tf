variable "project_name" {
  type = string
  #   default = "pulumi-practice-300214"
  default = "torah-anytime-to-podcast"
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "zone" {
  type    = string
  default = "us-central1-a"
}

# variable "gcp_service_list" {
#   type    = list(string)
#   default = ["run.googleapis.com"]
# }
