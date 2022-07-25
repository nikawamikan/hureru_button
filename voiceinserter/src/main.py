import yaml
import shutil
import os
import glob
import re
from pykakasi import kakasi

# ファイル全捜索
def find_all_files(directory):
    for root, dirs, files in os.walk(directory):
        yield root
        for file in files:
            yield os.path.join(root, file)

# ファイルを一番上の階層に取り出す
def file_move(dir:str):

    for file in find_all_files(dir):
        try:
            shutil.move(file, dir)
        except:
            ...

def filename_replace(path, regex=r"[0-9]+_", rep=""):
    # path → "./voice/*.mp3" のように書く
    for f in glob.glob(path):
        m = re.sub(regex, rep, f)
        print(m)
        os.rename(f, m)

def yml_builder(dir):
    d = []
    k = kakasi()
    for root, dirs, files in os.walk(dir):
        for f in files:
            r = k.convert(f[:-4])
            n = ""
            for c in r:
                n += c['hira']
            d.append({"name":f[:-4], "read":n, "address":f, "attrIds":[]})
            # print(f[:-4])
    return sorted(d, key=lambda x: x["name"])

# with open("voicelist.yml", "w", encoding="utf-8") as f:
#     yaml.dump(yml_builder('./voice'), f, default_flow_style=False, allow_unicode=True)
