variable "environment" {
  type        = string
  description = "Deployment environment; production requires an approved isolated network."
  default     = "development"
}
