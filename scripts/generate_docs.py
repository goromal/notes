import os

ROOTDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def find_markdown_files(directory):
    leaf_dir = directory.split(os.sep)[-1]
    markdown_files = []
    for file in os.listdir(directory):
        if file.endswith('.md') and file != "index.md" and file != "SUMMARY.md" and file != f"{leaf_dir}.md":
            markdown_files.append(file)
    return markdown_files

def list_directories(root_directory):
    directories = []
    for root, dirs, _ in os.walk(root_directory):
        for dir_name in dirs:
            directories.append(os.path.join(root, dir_name).replace(root_directory, ""))
    return directories

def recursive_directory_dict(root_directory):
    directory_dict = {}
    for root, dirs, _ in os.walk(root_directory):
        current_dict = directory_dict
        path_parts = os.path.relpath(root, root_directory).split(os.path.sep)
        for part in path_parts:
            current_dict = current_dict.setdefault(part, {})
    return directory_dict

def add_indent_to_multiline_string(text):
    indented_lines = []
    for line in text.splitlines():
        indented_lines.append('  ' + line)
    indented_text = '\n'.join(indented_lines)
    return indented_text

def form_nav_trees(nav_name, parent_dir, directory_dict):
    print(nav_name)
    if nav_name == "img":
        return ""
    nav_trunk = f"- [{nav_name.replace('_',' ')}]({os.path.join(parent_dir, nav_name)}.md)"
    nav_tree = ""
    markdown_files = find_markdown_files(parent_dir)
    for markdown_file in markdown_files:
        nav_tree += f"- [{markdown_file.replace('_',' ').replace('.md','')}]({os.path.join(parent_dir, markdown_file)})\n"
    for key, value in directory_dict.items():
        if key != ".":
            nav_tree += form_nav_trees(key, os.path.join(parent_dir, key), value)
    with open(os.path.join(parent_dir, f"{nav_name}.md"), "w") as navfile:
        navfile.write(f"# {nav_name.replace('_',' ')}\n\n")
        navfile.write(nav_tree.replace(str(parent_dir),"."))
    if len(directory_dict.items()) + len(markdown_files) > 0:
        return f"""{nav_trunk}
{add_indent_to_multiline_string(nav_tree)}
"""
    else:
        return ""

DOCS_SRC_DIR = os.path.join(ROOTDIR, "docs", "src")
directories = recursive_directory_dict(DOCS_SRC_DIR)
print(directories)
form_nav_trees("SUMMARY", DOCS_SRC_DIR, directories)

with open(os.path.join(DOCS_SRC_DIR, "SUMMARY.md"),"r") as sum_infile, open(os.path.join(ROOTDIR, "docs", "raw", "index.md"), "r") as idx_infile, \
    open(os.path.join(DOCS_SRC_DIR, "index.md"), "w") as idx_outfile:
    index_title = [line for i, line in enumerate(idx_infile) if i == 0][0][2:].rstrip()
    idx_infile.seek(0)
    summary_lines = [line for i, line in enumerate(sum_infile) if i > 1]
    idx_outfile.write(f"""{idx_infile.read()}
{''.join(summary_lines)}
""")

with open(os.path.join(DOCS_SRC_DIR, "SUMMARY.md"), "w") as sum_outfile:
    sum_outfile.write(f"""# Summary

- [{index_title}](./index.md)
{''.join(summary_lines)}
""")

# with open(os.path.join(ROOTDIR, "docs", "raw", "index.md"), "r") as raw_index, open(
#     os.path.join(ROOTDIR, "docs", "src", "index.md"), "w"
# ) as index:
#     index_text_raw = raw_index.read()
#     # TODO add total summary object at the end; add to end
#     readme.write(readme_text_raw.replace("RELEASETAGREPLACE", version_tag))

# summaryfile = open(os.path.join(ROOTDIR, "docs", "src", "SUMMARY.md"), "w")

# summaryfile.write("# Summary\n\n")
# # TODO dump summary file

# summaryfile.write("- [Andrew's Software](./intro.md)\n")
# summaryfile.write("- [Machine Management](./machines.md)\n")

# summaryfile.write("- [RFCs](./rfcs/rfcs.md)\n")
# rfcsfile.write("# RFCs\n\n")
# rfcsfile.write(
#     "Request For Comments (RFC) documents are convenient for organizing and iterating on designs for pieces of software. "
#     + "They can serve as north stars for the implementation of more complex software. Below are some examples of RFCs that I've used to "
#     + "guide some personal projects.\n\n"
# )
# for rfc in pkgs["rfcs"]:
#     print(rfc["file"])
#     rfcsfile.write(f"- [{rfc['title']}](./{rfc['file']}.md)\n")
#     summaryfile.write(f"  - [{rfc['title']}](./rfcs/{rfc['file']}.md)\n")

# for lang, title, desc in langs:
#     lang_pkgs = [
#         {"name": pkg["attr"].split(".")[-1], "attr": pkg["attr"]}
#         for pkg in pkgs["pkgs"][lang]
#         if pkg["docs"]
#     ]
#     lang_dir = os.path.join(ROOTDIR, "docs", "src", lang)
#     for filename in os.listdir(lang_dir):
#         file_path = os.path.join(lang_dir, filename)
#         if os.path.isfile(file_path) or os.path.islink(file_path):
#             os.unlink(file_path)
#     with open(os.path.join(lang_dir, f"{lang}.md"), "w") as langfile:
#         summaryfile.write(f"- [{title}](./{lang}/{lang}.md)\n")
#         langfile.write(f"# {title}\n\n")
#         langfile.write(f"{desc}\n\n")
#         for lang_pkg in lang_pkgs:
#             print(lang_pkg["name"])
#             pkgMdname = f"{lang_pkg['name']}.md"
#             summaryfile.write(f"  - [{lang_pkg['attr']}](./{lang}/{pkgMdname})\n")
#             langfile.write(f"- [{lang_pkg['attr']}](./{pkgMdname})\n")
#             with open(
#                 os.path.join(ROOTDIR, "docs", "src", lang, pkgMdname), "w"
#             ) as pkgfile:
#                 pkgfile.write(f"# {lang_pkg['attr']}\n\n")
#                 process = Popen(
#                     [
#                         "nix-build",
#                         ".",
#                         "-A",
#                         f"{lang_pkg['attr']}.doc",
#                         "--no-out-link",
#                     ],
#                     stdout=PIPE,
#                     stderr=PIPE,
#                 )
#                 docf, stderr = process.communicate()
#                 exit_code = process.returncode
#                 if exit_code != 0:
#                     print(
#                         f"ERROR: doc attribute generation for package {lang_pkg['attr']} failed: {docf.decode()}\n\n{stderr.decode()}"
#                     )
#                     exit(1)
#                 with open(docf.decode().strip(), "r") as docfile:
#                     docstr = docfile.read()
#                     pkgfile.write(docstr)

# rfcsfile.close()
# summaryfile.close()
