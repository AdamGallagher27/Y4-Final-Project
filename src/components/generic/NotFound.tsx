
interface Props {
  item: string
}

const NotFound = ({ item }: Props) => {
  return <div>{item} not found</div>
}

export default NotFound