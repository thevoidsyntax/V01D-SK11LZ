---
name: ansible
description: Ansible configuration management, playbook design, roles, inventory management, and automation patterns.
---

# Ansible - Configuration Management

## Inventory Structure

### inventory.ini
```ini
# inventory.ini
[webservers]
web1.example.com ansible_host=192.168.1.10
web2.example.com ansible_host=192.168.1.11

[webservers:vars]
ansible_user=ubuntu
http_port=80

[dbservers]
db1.example.com ansible_host=192.168.1.20

[dbservers:vars]
ansible_user=ubuntu
db_port=5432

[production:children]
webservers
dbservers

[production:vars]
ansible_python_interpreter=/usr/bin/python3
environment=production
```

### inventory.yml (YAML format)
```yaml
---
all:
  children:
    webservers:
      hosts:
        web1.example.com:
          ansible_host: 192.168.1.10
        web2.example.com:
          ansible_host: 192.168.1.11
      vars:
        ansible_user: ubuntu
        http_port: 80
    dbservers:
      hosts:
        db1.example.com:
          ansible_host: 192.168.1.20
      vars:
        ansible_user: ubuntu
        db_port: 5432
  vars:
    ansible_python_interpreter: /usr/bin/python3
    environment: production
```

## Playbook Structure

### Basic Playbook
```yaml
---
- name: Setup webservers
  hosts: webservers
  become: yes
  vars:
    nginx_version: "1.24.0"

  tasks:
    - name: Update apt cache
      ansible.builtin.apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install Nginx
      ansible.builtin.apt:
        name:
          - nginx
          - python3-pip
        state: present

    - name: Start Nginx
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: yes

    - name: Configure Nginx
      ansible.builtin.template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: Restart Nginx

  handlers:
    - name: Restart Nginx
      ansible.builtin.service:
        name: nginx
        state: restarted
```

### Multi-Environment Playbook
```yaml
---
# NOTE: This YAML uses Jinja2 template syntax ({{ variable }})
# These are Ansible variable placeholders, not literal values
# Variables are defined in vars_files or inventory
- name: Deploy application
  hosts: "{{ target_environment }}"
  become: yes
  vars_files:
    - "vars/{{ target_environment }}.yml"

  pre_tasks:
    - name: Show deployment info
      ansible.builtin.debug:
        msg: "Deploying {{ app_version }} to {{ target_environment }}"

  tasks:
    - name: Create application directory
      ansible.builtin.file:
        path: /opt/myapp
        state: directory
        owner: www-data
        group: www-data
        mode: '0755'

    - name: Deploy application files
      ansible.builtin.copy:
        src: "{{ release_path }}/"
        dest: /opt/myapp/
        owner: www-data
        group: www-data
      notify: Restart application

    - name: Setup systemd service
      ansible.builtin.template:
        src: myapp.service.j2
        dest: /etc/systemd/system/myapp.service
      notify: Reload systemd

  handlers:
    - name: Restart application
      ansible.builtin.systemd_service:
        name: myapp
        state: restarted
        daemon_reload: yes
```

## Roles Structure

### Role Directory
```
roles/
├── common/
│   ├── tasks/
│   │   └── main.yml
│   ├── handlers/
│   │   └── main.yml
│   ├── templates/
│   │   └── motd.j2
│   ├── files/
│   │   └── banner
│   ├── vars/
│   │   └── main.yml
│   ├── defaults/
│   │   └── main.yml
│   └── meta/
│       └── main.yml
```

### tasks/main.yml
```yaml
---
# roles/common/tasks/main.yml
# NOTE: {{ variable }} syntax is Jinja2 template notation used by Ansible
- name: Set hostname
  ansible.builtin.hostname:
    name: "{{ inventory_hostname }}"

- name: Update apt cache
  ansible.builtin.apt:
    update_cache: yes
    cache_valid_time: 3600
  when: ansible_os_family == "Debian"

- name: Install common packages
  ansible.builtin.apt:
    name:
      - curl
      - wget
      - vim
      - git
    state: present

- name: Setup MOTD
  ansible.builtin.template:
    src: motd.j2
    dest: /etc/motd
    mode: '0644'
```

### defaults/main.yml
```yaml
---
# roles/common/defaults/main.yml
common_timezone: UTC
common_packages:
  - curl
  - wget
  - vim
  - git
```

### handlers/main.yml
```yaml
---
# roles/common/handlers/main.yml
- name: Restart sshd
  ansible.builtin.service:
    name: sshd
    state: restarted
```

## Variables & Facts

### Variable Precedence
```
1. command line -e (highest)
2. role defaults (lowest)
```

### Using Variables
```yaml
---
# NOTE: Variables in {{ vault_... }} are Ansible vault-encrypted secrets
- name: Configure database
  hosts: dbservers
  vars:
    db_name: myapp
    db_user: appuser
    db_password: "{{ vault_db_password }}"

  tasks:
    - name: Create database
      community.postgresql.postgresql_db:
        name: "{{ db_name }}"

    - name: Create database user
      community.postgresql.postgresql_user:
        name: "{{ db_user }}"
        password: "{{ db_password }}"
        priv: "{{ db_name }}:ALL"
        state: present
```

### Registered Variables
```yaml
---
- name: Check Nginx status
  ansible.builtin.service:
    name: nginx
    state: started
  register: nginx_service

- name: Show result
  ansible.builtin.debug:
    var: nginx_service

# NOTE: {{ item }} and {{ user_list }} are Jinja2 loop/filter syntax
- name: Create users from file
  ansible.builtin.user:
    name: "{{ item.name }}"
    state: present
  loop: "{{ user_list }}"
  register: user_creation

- name: Show creation results
  ansible.builtin.debug:
    msg: "Created {{ user_creation.results | length }} users"
```

## Conditionals & Loops

### When
```yaml
---
- name: Setup for RedHat
  ansible.builtin.yum:
    name: httpd
    state: present
  when: ansible_os_family == "RedHat"

- name: Setup for Debian
  ansible.builtin.apt:
    name: apache2
    state: present
  when: ansible_os_family == "Debian"

- name: Install webserver if required
  ansible.builtin.package:
    name: nginx
    state: present
  when: inventory_hostname in groups['webservers']
```

### Loops
```yaml
---
# NOTE: Jinja2 template syntax {{ item }} for loops
- name: Create multiple directories
  ansible.builtin.file:
    path: "{{ item }}"
    state: directory
  loop:
    - /opt/app
    - /opt/logs
    - /opt/data

# NOTE: Jinja2 filters like default() and omit are Ansible template features
- name: Create users
  ansible.builtin.user:
    name: "{{ item.name }}"
    shell: "{{ item.shell | default('/bin/bash') }}"
    groups: "{{ item.groups | default(omit) }}"
  loop:
    - { name: 'alice', groups: 'sudo' }
    - { name: 'bob', shell: '/bin/zsh' }

- name: Install packages
  ansible.builtin.apt:
    name: "{{ packages }}"
  vars:
    packages:
      - git
      - curl
      - vim
```

## Templates

### nginx.conf.j2
```jinja2
user www-data;
worker_processes {{ ansible_processor_vcpus }};
pid /run/nginx.pid;

events {
    worker_connections {{ worker_connections }};
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout {{ keepalive_timeout }};
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss;

    server {
        listen {{ http_port }};
        server_name {{ server_name }};

        location / {
            root {{ document_root }};
            index index.html;
        }

        location /api {
            proxy_pass http://localhost:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## Vault (Secrets)

### Encrypt Variables
```bash
# Create encrypted file
ansible-vault create group_vars/all/vault.yml

# Encrypt existing file
ansible-vault encrypt group_vars/all/vault.yml

# Edit encrypted file
ansible-vault edit group_vars/all/vault.yml

# View encrypted file
ansible-vault view group_vars/all/vault.yml
```

### vault.yml
```yaml
---
# Encrypted with ansible-vault
# Example values - REPLACE WITH ACTUAL SECRETS
vault_db_password: "<DB_PASSWORD>"
vault_api_key: "<API_KEY>"
vault_s3_secret_key: "<S3_SECRET_KEY>"
```

### Run with Vault
```bash
# Interactive password prompt
ansible-playbook site.yml --ask-vault-pass

# Password file
ansible-playbook site.yml --vault-password-file ~/.vault_pass

# Multiple vault IDs
ansible-playbook site.yml --vault-id prod@prompt --vault-id dev@prompt
```

## Testing

### ansible-lint
```bash
# Install
pip install ansible-lint

# Run lint
ansible-lint site.yml

# With custom rules
ansible-lint -c .ansible-lint site.yml
```

### molecule (Role Testing)
```yaml
# molecule/default/molecule.yml
---
dependency:
  name: galaxy
driver:
  name: docker
platforms:
  - name: instance
    image: geerlingguy/docker-ubuntu2204-ansible:latest
provisioner:
  name: ansible
verifier:
  name: ansible
```

```bash
# Test role
cd roles/myrole
molecule test

# Commands
molecule create    # Create instances
molecule converge  # Run playbook
molecule verify    # Run tests
molecule destroy   # Clean up
```

## Best Practices

### Directory Structure
```
project/
├── inventory/
│   ├── development/
│   └── production/
├── playbooks/
│   ├── site.yml
│   ├── webservers.yml
│   └── dbservers.yml
├── roles/
│   ├── common/
│   ├── nginx/
│   └── postgresql/
├── group_vars/
│   └── all/
├── host_vars/
├── ansible.cfg
└── requirements.yml
```

### ansible.cfg
```ini
[defaults]
inventory = inventory/production
host_key_checking = False
retry_files_enabled = False
gathering = smart
fact_caching = jsonfile
fact_caching_connection = /tmp/ansible_facts
fact_caching_timeout = 86400

[privilege_escalation]
become = True
become_method = sudo
become_user = root
become_ask_pass = False

[ssh_connection]
pipelining = True
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
```

---

**Invoke:** `/ansible` | **Priority:** LOW
