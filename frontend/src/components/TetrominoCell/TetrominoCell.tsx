import { TETROMINOES } from '@constants/tetrominoes';
import './TetrominoCell.scss';

interface TetrominoCellPropsType {
  tetrominoType: number | string;
}

function TetrominoCell({ tetrominoType }: TetrominoCellPropsType) {
  const cellColor = TETROMINOES[tetrominoType].color;

  return (
    <div
      className="cell"
      style={{
        // border: tetrominoType === 0 ? '0px solid' : '0.3vw solid transparent',
        background: `rgba(${cellColor}, 0.65)`,
        borderBottom: `0.3vw solid rgba(${cellColor}, 0.1)`,
        borderRight: `0.3vw solid rgba(${cellColor}, 1)`,
        borderTop: `0.3vw solid rgba(${cellColor}, 1)`,
        borderLeft: `0.3vw solid rgba(${cellColor}, 0.3)`,
      }}
    ></div>
  );
}

export default TetrominoCell;
