
interface MusicGradeProps {
    id:string,
    song_name:string,
    level:string,
    level_index:number,
    achievements:number,
    fc:number,
    fs:number,
    dx_score:number,
    dx_rating:number,
    rate:number,
    type:string
}

export default function MusicGrade () {
  return (
    <div>
      <h1>Music Grade</h1>
    </div>
  );
}
