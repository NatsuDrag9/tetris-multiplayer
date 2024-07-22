import './DisplayLabel.scss';

interface DisplayLabelPropsType {
  labelName: string;
  labelContent: string;
  gameOver: boolean;
  labelTestId: string;
}

function DisplayLabel({
  labelName,
  labelContent,
  gameOver,
  labelTestId,
}: DisplayLabelPropsType) {
  return (
    <div className="display-label">
      {!gameOver && <p className="display-label__name">{labelName}</p>}
      <p
        className={`display-label__content ${gameOver ? 'game-over' : ''}`}
        data-testid={labelTestId}
      >
        {labelContent}
      </p>
    </div>
  );
}

export default DisplayLabel;
