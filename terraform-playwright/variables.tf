variable "timeweb_token" {
  description = "API Token for Timeweb Cloud"
  type        = string
}

variable "instance_name" {
  description = "Имя временного сервера"
  type        = string
  default     = "parser-instance"
}

variable "image_id" {
  description = "ID образа ОС (Ubuntu 22.04)"
  type        = string
  default     = "ubuntu-22-04"
}

variable "instance_type" {
  description = "Тип машины"
  type        = string
  default     = "standard"
}

variable "ssh_key" {
  description = "SSH ключ для подключения"
  type        = string
}
