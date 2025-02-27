import { ChartType, DifficultyInfo, getDifficultyColor, Song } from "../songModel";

export default function NoteTable({ song, chartType }: { song: Song, chartType: ChartType }) {
  let songData: DifficultyInfo[] = []

  switch (chartType) {
    case ChartType.STANDARD:
      songData = song.difficulties.standard
      break
    case ChartType.DX:
      songData = song.difficulties.dx
      break
    case ChartType.UTAGE:
      songData = song.difficulties.utage
      break
    default:
      songData = []
      break
  }

  const getTotalNotes = (diff: DifficultyInfo) => {
    const noteTypes = ['tap_num', 'hold_num', 'slide_num', 'touch_num', 'break_num'];
    return noteTypes.reduce((sum, type) => sum + (diff[type as keyof DifficultyInfo] as number), 0);
  };

  return (
    <table className="w-full mt-4 border-collapse table-fixed">
      <thead>
        <tr>
          <th className="border-2 border-gray-500 bg-slate-300 p-2 text-black">难度</th>
          <th className="border-2 border-gray-500 bg-slate-300 p-2 text-black">Tap</th>
          <th className="border-2 border-gray-500 bg-slate-300 p-2 text-black">Hold</th>
          <th className="border-2 border-gray-500 bg-slate-300 p-2 text-black">Slide</th>
          <th className="border-2 border-gray-500 bg-slate-300 p-2 text-black">Touch</th>
          <th className="border-2 border-gray-500 bg-slate-300 p-2 text-black">Break</th>
          <th className="border-2 border-gray-500 bg-slate-300 p-2 text-black">Total</th>
        </tr>
      </thead>
      <tbody>
        {songData.map((diff, idx) => (
          <tr key={idx}>
            <td
              className="border-2 border-gray-500 p-2 text-lg text-white"
              style={{
                backgroundColor: chartType == 'utage' ?
                  "rgb(220, 56, 184)"
                  : getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
              }}
            >
              {chartType == 'utage' ? `${diff.level} | ${diff.kanji}` : diff.level_value}</td>
            <td className="border-2 border-gray-500 p-2 text-lg text-black">{diff.tap_num}</td>
            <td className="border-2 border-gray-500 p-2 text-lg text-black">{diff.hold_num}</td>
            <td className="border-2 border-gray-500 p-2 text-lg text-black">{diff.slide_num}</td>
            <td className="border-2 border-gray-500 p-2 text-lg text-black">{diff.touch_num}</td>
            <td className="border-2 border-gray-500 p-2 text-lg text-black">{diff.break_num}</td>
            <td className="border-2 border-gray-500 p-2 text-lg text-black">{getTotalNotes(diff)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}