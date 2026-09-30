// by: https://raw.githubusercontent.com/xishang0128/sub-store-template/main/sing-box.js
const { type, name } = $arguments

let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['selector', '♻️ 自动选择'].includes(i.type)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (i.tls) {
    i.tls.ech.enabled = false;
  }
})

// 兼容空outbounds的情况
config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    outbound.outbounds.push('DIRECT');
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
