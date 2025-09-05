import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Upload = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Upload Section */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-[80%] max-w-3xl">
          {/* Heading */}
          <h1 className="text-3xl text-gray-800 mb-6 mt-6 text-center">
            Upload Lecture Notes
          </h1>
          <div className="space-y-6">
            <input type="text" placeholder='Enter the Course Title'
            className=' 
            block w-full text-base text-gray-700
            border border-gray-300 rounded-lg
                         px-2 py-3
                         mb-2'
                          required
            />
            <input type="text" placeholder='Enter the Course Code'
            className=' 
            block w-full text-base text-gray-700
            border border-gray-300 rounded-lg
                         px-2 py-3
                         mb-2'
                         required
            />
            <input type="text" placeholder='Enter the Year You’re uploading this note'
            className=' 
            block w-full text-base text-gray-700
            border border-gray-300 rounded-lg
                         px-2 py-3
                         mb-4'
                          required
            />
          </div>
          <h3 className="text-lg text-gray-600 mb-3">
            Upload your file (txt, pdf)
          </h3>

          {/* File Upload */}
          <div className="space-y-6">
            <input
              type="file"
              accept=".txt,.pdf"
              className="block w-full text-base text-gray-700
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-gray-300 file:text-black
                         hover:file:bg-gray-200
                         border border-gray-300 rounded-lg
                         px-2 py-2"
            />

            <div className="flex items-center justify-center">
              <button
                type="button"
                className="bg-indigo-600 text-white px-10 py-3 rounded-lg hover:bg-indigo-700 text-base font-semibold"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Upload
