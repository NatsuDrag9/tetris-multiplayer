function removeHyphensFromUUID(uuid: string) {
  return uuid.replace(/-/g, '');
}

export default removeHyphensFromUUID;
