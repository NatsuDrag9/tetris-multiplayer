import './DisplayLabel.scss';

interface DisplayLabelPropsType {
  labelName: string;
  labelContent: string;
  gameOver: boolean;
}

function DisplayLabel({
  labelName,
  labelContent,
  gameOver,
}: DisplayLabelPropsType) {
  return (
    <div className="display-label">
      {!gameOver && <p className="display-label__name">{labelName}</p>}
      <p className={`display-label__content ${gameOver ? 'game-over' : ''}`}>
        {labelContent}
      </p>
    </div>
  );
}

export default DisplayLabel;
