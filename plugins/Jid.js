module.exports = {
  command: 'jid',
  alias: ['id', 'getjid'],
  description: 'Get the JID (user/group/channel ID) of the sender or quoted message',
  category: 'tools',

  execute: async (sock, m, { reply }) => {
    // Detect chat type
    const isGroup = m.chat.endsWith('@g.us');
    const isChannel = m.chat.endsWith('@newsletter');

    // Determine the target JID
    let targetJid = m.key.participant || m.key.remoteJid; // Sender in group/channel or chat in PM

    // If message is quoted, get the quoted user's JID instead
    if (m.quoted && m.quoted.key) {
      targetJid = m.quoted.key.participant || m.quoted.key.remoteJid;
    }

    let text = `📋 *JID Information*\n\n`;

    // Show proper label for chat type
    if (isGroup) {
      text += `*Group JID:* ${m.chat}\n`;
    } else if (isChannel) {
      text += `*Channel JID:* ${m.chat}\n`;
    }

    text += `*User JID:* ${targetJid}\n`;
    
    if (m.quoted) {
      text += `*(From quoted message)*\n`;
    } else if (isGroup) {
      text += `*(Message sender in group)*\n`;
    } else if (isChannel) {
      text += `*(Message sender/poster in channel)*\n`;
    } else {
      text += `*(Private chat)*\n`;
    }

    // Premium-style reactions
    for (const emoji of ['🔍', '📌', '✅']) {
      await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
    }

    await reply(text);
  }
};
