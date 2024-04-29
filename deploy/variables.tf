variable "region" {
  type          = string
  description   = "Region in which to create resources"
}

variable "subnet_ids" {
  type          = list(string)
  description   = "Array of subnet ids"
}

variable "security_group_ids" {
  type          = list(string)
  description   = "Array of security_group_ids" 
}

variable "host" {
  type          = string
  description   = "Lambda Env variable"
}

variable "port" {
  type          = string
  description   = "Lambda Env variable"
}

variable "prog_name" {
  type          = string
  description   = "Name of Program"
}