
interface Props {
  firstPartOfTitle: string
  secondPartOfTitle: string
}

const Title = ({ firstPartOfTitle, secondPartOfTitle }: Props) => {
  return <div className='font-semibold text-xl m-2'><span className='text-[#94A3B8]'>{firstPartOfTitle} / </span>{secondPartOfTitle}</div>
}

export default Title