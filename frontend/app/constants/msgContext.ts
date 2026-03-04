/**
 * 消息右键菜单上下文名称（ctx-name）常量与类型
 *
 * 有菜单（用于右键菜单，在 contextMenuType 中有对应配置）：
 *   CONTENT, URL_LINK, TRANSLATION, IMG, FILE, SOUND, NICKNAME, AVATAR, RTC, VIDEO
 *
 * 仅结构（不单独对应菜单项，用于区域划分或冒泡到父级菜单）：
 *   REPLY, MENTION_LIST, SOUND_TRANSLATION, VIDEO_DURATION
 */

export const MSG_CTX_NAMES = {
  // 有菜单
  CONTENT: 'content',
  URL_LINK: 'url_link',
  TRANSLATION: 'translation',
  IMG: 'img',
  FILE: 'file',
  SOUND: 'sound',
  NICKNAME: 'nickname',
  AVATAR: 'avatar',
  RTC: 'rtc',
  VIDEO: 'video',
  // 仅结构
  REPLY: 'reply',
  MENTION_LIST: 'mentionList',
  SOUND_TRANSLATION: 'sound-translation',
  VIDEO_DURATION: 'video-duration'
} as const

export type MessageCtxName = (typeof MSG_CTX_NAMES)[keyof typeof MSG_CTX_NAMES]

export type MessageCtxNameWithMenu =
  | typeof MSG_CTX_NAMES.CONTENT
  | typeof MSG_CTX_NAMES.URL_LINK
  | typeof MSG_CTX_NAMES.TRANSLATION
  | typeof MSG_CTX_NAMES.IMG
  | typeof MSG_CTX_NAMES.FILE
  | typeof MSG_CTX_NAMES.SOUND
  | typeof MSG_CTX_NAMES.NICKNAME
  | typeof MSG_CTX_NAMES.AVATAR
  | typeof MSG_CTX_NAMES.RTC
  | typeof MSG_CTX_NAMES.VIDEO
