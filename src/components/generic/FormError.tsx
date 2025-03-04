
interface Props {
  message: string
}

const FormError = ({ message }: Props) => {
  return message && <div className='text-red-500 text-xs ml-2'>{message}</div>
}

export default FormError