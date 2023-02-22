import os
import zipfile
import urllib.request
import shutil
import platform

pluginsKey = "GRAFANA_PLUGINS"
pluginsVolume = "/var/lib/grafana/plugins"
ARCH = os.environ.get("ARCH", platform.machine())
OS = os.environ.get("OS", platform.system().lower())


class ZipFileWithPermissions(zipfile.ZipFile):
    """Custom ZipFile class handling file permissions."""

    def _extract_member(self, member, targetpath, pwd):
        if not isinstance(member, zipfile.ZipInfo):
            member = self.getinfo(member)

        targetpath = super()._extract_member(member, targetpath, pwd)

        attr = member.external_attr >> 16
        if attr != 0:
            os.chmod(targetpath, attr)
        return targetpath


def getPlugins():
    result = list()
    if pluginsKey in os.environ and not (not os.environ[pluginsKey]):
        plugins = os.environ[pluginsKey].split(",")
        for plugin in plugins:
            parts = plugin.split(":", 1)
            plugin_url = ""
            name = ""
            if len(parts) == 2:
                if parts[0] == "url":
                    plugin_url = parts[1]
                    name = "/tmp/%s.zip" % plugin_url.rsplit("/", 1)[-1]
                else:
                    plugin_url = f"https://grafana.com/api/plugins/{parts[0]}/versions/{parts[1]}/download?os={OS}&arch={ARCH}"
                    name = f"/tmp/{parts[0]}_{parts[1]}.zip"
            elif len(parts) == 1:
                plugin_url = f"https://grafana.com/api/plugins/{parts[0]}/versions/latest/download?os={OS}&arch={ARCH}"
                name = f"/tmp/{parts[0]}_latest.zip"
            else:
                print("Invalid syntax (version missing?): " + plugin)

            result.append((plugin_url, name))
    return result


def downloadPlugin(plugin):
    url, file_name = plugin
    print(f"downloading {url}")
    with urllib.request.urlopen(url) as response, open(file_name, "wb") as out_file:
        shutil.copyfileobj(response, out_file)
    return file_name


def extractPlugin(file_name):
    print(f"extracting {file_name}")
    zip = ZipFileWithPermissions(file_name)
    zip.extractall(pluginsVolume)
    zip.close()


def installPlugin(plugin):
    try:
        file_name = downloadPlugin(plugin)
    except Exception as err:
        print("Error downloading %s:%s: %s" % (*plugin, err))
    else:
        extractPlugin(file_name)


def main():
    for plugin in getPlugins():
        installPlugin(plugin)
    print("done")


main()
