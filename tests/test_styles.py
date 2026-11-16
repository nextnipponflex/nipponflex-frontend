import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from clean_styles import clean_css
class StyleCleanupTests(unittest.TestCase):
 def test_last_declaration_wins(self):
  css,stats=clean_css('.a{color:red}.a{color:blue}')
  self.assertNotIn('red',css);self.assertIn('blue',css)
 def test_important_survives_later_normal(self):
  css,_=clean_css('.a{color:red!important}.a{color:blue}')
  self.assertIn('red!important',css)
 def test_contexts_are_independent(self):
  css,_=clean_css('.a{color:red}@media(min-width:1024px){.a{color:blue}}')
  self.assertIn('red',css);self.assertIn('blue',css)
 def test_selector_functions_are_not_split(self):
  css,_=clean_css(':is(.a,.b){color:red}')
  self.assertIn(':is(.a,.b)',css)
 def test_data_urls_are_not_split(self):
  css,_=clean_css('.a{background:url("data:image/svg+xml;x:y");color:red}')
  self.assertIn('data:image/svg+xml;x:y',css)
 def test_shorthand_does_not_erase_longhand(self):
  css,_=clean_css('.a{margin-left:4px;margin:8px}')
  self.assertIn('margin-left',css);self.assertIn('margin:',css)
if __name__=='__main__':unittest.main()
