"use client";

import { useState } from "react";
import Modal from "./modal";

export default function ModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"sm" | "md" | "lg" | "xl">("md");

  const openModal = (size: "sm" | "md" | "lg" | "xl") => {
    setModalSize(size);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Modal Component Demo
      </h1>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => openModal("sm")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Open Small Modal
        </button>

        <button
          onClick={() => openModal("md")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Open Medium Modal
        </button>

        <button
          onClick={() => openModal("lg")}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          Open Large Modal
        </button>

        <button
          onClick={() => openModal("xl")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Open Extra Large Modal
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalSize.toUpperCase()} Modal`}
        size={modalSize}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This is a {modalSize} sized modal with smooth animations!
          </p>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Smooth fade and slide animations</li>
              <li>Backdrop blur effect</li>
              <li>Click outside to close</li>
              <li>Press Escape key to close</li>
              <li>Prevents body scroll when open</li>
              <li>Customizable sizes (sm, md, lg, xl)</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
