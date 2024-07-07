# https://pygments.org/docs/quickstart/

from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter

with open('pygments-gen.txt') as f:
    code = f.read()

print(highlight(code, PythonLexer(), HtmlFormatter()))

# https://pygments.org/styles/
# print(HtmlFormatter(style='fruity').get_style_defs('.highlight'))
