import DragDropGame from '../components/DragDropGame'

export default function Activity() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Sort the Computers</h1>
      <p className="text-gray-400 mb-8">
        Drag each real-world example into the computer category it belongs to.
      </p>
      <DragDropGame />
    </div>
  )
}
