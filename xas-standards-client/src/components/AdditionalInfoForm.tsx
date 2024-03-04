function AdditionalInformationForm(props) {
  const comments = props.comments;
  const setComments = props.setComments;

  const handleFile2 = props.handleFile2;
  return (
    <fieldset className="twocolumn">
      <legend>Additional Information</legend>
      <label htmlFor="comments">Comments</label>
      <input
        type="text"
        id="comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      ></input>
      <input type="file" name="file2" onChange={handleFile2} multiple />
    </fieldset>
  );
}

export default AdditionalInformationForm;
