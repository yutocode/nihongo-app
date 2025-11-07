// src/components/avatars/index.js
import JellyfishLogo from "./JellyfishLogo";

/**
 * 個別コンポーネント
 */
export { JellyfishLogo };

/**
 * AvatarPicker / Header などから使うマップ
 * - avatarKey: "jellyfish"
 */
export const AVATAR_ICON_MAP = {
  jellyfish: JellyfishLogo,
};
