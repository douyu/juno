from fabric import Connection

with Connection(host="root@123.57.192.12") as c:
    c.put("./juno-admin.zip", "/tmp")
    c.run("rm -rf /home/www/server/juno-admin")
    c.run("mkdir -p /home/www/server/juno-admin")
    c.run("unzip -d /home/www/server/juno-admin /tmp/juno-admin.zip")
    c.run("rm -f /tmp/juno-admin.zip")
    # c.run("sudo supervisorctl restart juno-admin")
