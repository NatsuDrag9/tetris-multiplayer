import './DisplayLabel.scss';

interface DisplayLabelPropsType {
  labelName: string;
  labelContent: string;
}

function DisplayLabel({ labelName, labelContent }: DisplayLabelPropsType) {
  return (
    <div className="display-label">
      <p className="display-label__name">{labelName}</p>
      <p className="display-label__content">{labelContent}</p>
    </div>
  );
}

export default DisplayLabel;
