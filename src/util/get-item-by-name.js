export default function getItemByName(name, list) {
  return list.reduce((item, listItem) => listItem.name === name ? listItem : item, null);
}
