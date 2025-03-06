import { useState } from 'react'

const useModal = () => {
  const [isVisible, setIsVisible] = useState(false)

  const openModal = () => setIsVisible(true)
  const closeModal = () => setIsVisible(false)
  const toggleModal = () => setIsVisible((prevState) => !prevState)

  return {
    isVisible,
    openModal,
    closeModal,
    toggleModal
  }
}

export default useModal
