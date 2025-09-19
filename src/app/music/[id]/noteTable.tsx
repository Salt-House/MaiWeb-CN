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
    <div className="overflow-x-scroll">
      <table className="w-full text-black mt-4 border-collapse rounded-t-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-pink-50 to-rose-50">
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 border-b-2 border-pink-200">难度</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 border-b-2 border-pink-200">Tap</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 border-b-2 border-pink-200">Hold</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 border-b-2 border-pink-200">Slide</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 border-b-2 border-pink-200">Touch</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 border-b-2 border-pink-200">Break</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 border-b-2 border-pink-200">Total</th>
          </tr>
        </thead>
        <tbody>
          {songData.map((diff, idx) => {
            const diffColor = chartType == 'utage'
              ? "rgb(220, 56, 184)"
              : getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4);

            return (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td
                  className="py-3 px-4 flex items-center justify-center"
                >
                  <span
                    className="flex items-center justify-center min-w-16 h-8 px-2 whitespace-nowrap rounded-md shadow-sm text-white"
                    style={{ backgroundColor: diffColor }}
                  >
                    {chartType == 'utage' ? `${diff.level} | ${diff.kanji}` : diff.level_value}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-700">{diff.tap_num}</td>
                <td className="py-3 px-4 text-center text-gray-700">{diff.hold_num}</td>
                <td className="py-3 px-4 text-center text-gray-700">{diff.slide_num}</td>
                <td className="py-3 px-4 text-center text-gray-700">
                  {(chartType == ChartType.STANDARD) ?
                    <span className="text-gray-400">-</span> :
                    diff.touch_num}
                </td>
                <td className="py-3 px-4 text-center text-gray-700">{chartType == 'standard' ? `${diff.touch_num}` : `${diff.break_num}`}</td>
                <td className="py-3 px-4 text-center font-medium">{getTotalNotes(diff)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}