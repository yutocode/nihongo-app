export const getPosByLesson = (lessonNo) => {
  if (lessonNo >= 1 && lessonNo <= 6) return "名詞";
  if (lessonNo >= 7 && lessonNo <= 8) return "い形容詞";
  if (lessonNo === 9) return "な形容詞";
  if (lessonNo === 10) return "副詞/表現";
  if (lessonNo === 11) return "助詞/接続";
  if (lessonNo === 12) return "助数詞";
  if (lessonNo >= 13 && lessonNo <= 14) return "動詞";
  return "";
};
