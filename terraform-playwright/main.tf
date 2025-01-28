terraform {
  required_providers {
    timeweb = {
      source  = "timeweb/timeweb"
      version = "~> 0.1"
    }
  }
}

provider "timeweb" {
  token = var.timeweb_token  # API-токен для Timeweb
}
resource "timeweb_instance" "parser_server" {
  name  = var.instance_name
  image = var.image_id
  type  = var.instance_type
  ssh_keys = [var.ssh_key]

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nodejs npm",
      "npm install -g playwright",
      "node /home/ubuntu/parser.js"
    ]
  }
}
