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
  if (['🖲️ 手动选择', '♻️ 自动选择', '☁️ 故障转移', '🔮 负载均衡'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 香港节点-♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|hong kong|🇭🇰/i))
  }
  if (['🇹🇼 台湾节点-♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
  }
  if (['🇯🇵 日本节点-♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日|jp|japan|🇯🇵/i))
  }
  if (['🇺🇸 美国节点-♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
  }
  if (['🇸🇬 新加坡节点-♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /新|sg|singapore|🇸🇬/i))
  }
  if (['🇺🇳 其它地区-♻️ 自动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(🇭🇰|🇹🇼|🇯🇵|🇺🇸|🇸🇬|🇨🇳|🇰🇷|港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates)).*$/i))
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
