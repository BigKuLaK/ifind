const fetch = require('node-fetch');

fetch('https://de.aliexpress.com/item/1005002485985624.html?aff_fcid=ba8ac3498e77443fbd89bc44b58e1db1-1629811581577-02184-_pzL6jQz&aff_fsk=_pzL6jQz&aff_platform=api-new-link-generate&sk=_pzL6jQz&aff_trace_key=ba8ac3498e77443fbd89bc44b58e1db1-1629811581577-02184-_pzL6jQz&terminal_id=edaacabf27d34b2e83c70f319c00cb7a', {
  redirect: 'follow'
})
.then(res => console.log(res.url));
