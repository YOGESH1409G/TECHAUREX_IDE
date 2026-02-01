import * as prettier from 'prettier/standalone';
import * as babel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';

self.onmessage = async (e) => {
  const { code, language } = e.data;
  try {
    // Map language to parser
    const parser = language === 'typescript' ? 'babel-ts' : language === 'json' ? 'json' : language === 'html' ? 'html' : 'babel';
    const plugins = [babel, estree];
    const formatted = await prettier.format(code, { parser, plugins });
    self.postMessage({ ok: true, code: formatted });
  } catch (err) {
    self.postMessage({ ok: false, error: err?.message || String(err) });
  }
};


