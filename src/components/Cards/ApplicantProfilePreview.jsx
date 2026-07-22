import { Download, X } from "lucide-react"
import { useState, useEffect } from "react"
import { getInitials } from "../../utils/helper"
import moment from "moment"
import toast from 'react-hot-toast'
import StatusBadge from "../StatusBadge"
import { useUpdateApplicationStatusMutation } from "../../store/slices/applicationSlice"

const statusOptions = ['Applied', 'In Review', 'Rejected', 'Accepted']

const ApplicantProfilePreview = ({
    selectedApplicant,
    setSelectedApplicant,
    handleDownloadResume,
    handleClose
}) => {

    // const [currentStatus, setCurrentStatus] = useState(selectedApplicant.status)
    const [currentStatus, setCurrentStatus] = useState("");
    const [updateStatus, { isLoading }] = useUpdateApplicationStatusMutation();


    useEffect(() => {
        if (selectedApplicant?.status) {
            setCurrentStatus(selectedApplicant.status);
        }
    }, [selectedApplicant]);

    const onChangeStatus = async (e) => {
        const newStatus = e.target.value;

        if (!selectedApplicant?._id) return;

        try {
            await updateStatus({
                id: selectedApplicant._id,
                status: newStatus,
            }).unwrap();

            setSelectedApplicant({
                ...selectedApplicant,
                status: newStatus,
            });

            setCurrentStatus(newStatus);
            toast.success("Application status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] bg-opacity-50 flex items-center justify-center p-4 z-5">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Applicant Profile
                    </h3>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleClose()}
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        {selectedApplicant.applicant.avatar ? (
                            <img
                                src={selectedApplicant.applicant.avatar}
                                alt={selectedApplicant.applicant.name}
                                className="h-20 w-20 rounded-full object-cover mx-auto"
                            />
                        ) : (
                            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                                <span className="text-blue-600 font-semibold text-xl">
                                    {getInitials(selectedApplicant.applicant.name)}
                                </span>
                            </div>
                        )}
                        <h4 className="mt-4 text-xl font-semibold text-gray-900">
                            {selectedApplicant.applicant.name}
                        </h4>
                        <p className="text-gray-600">
                            {selectedApplicant.applicant.email}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">
                                Applied Position
                            </h5>
                            <p className="text-gray-700">{selectedApplicant.job.title}</p>
                            <p className="text-gray-600 text-sm mt-1">
                                {selectedApplicant.job.location} • {selectedApplicant.job.type}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">
                                Application Details
                            </h5>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="">Status:</span>
                                    <StatusBadge status={currentStatus} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Applied Date:</span>
                                    <span className="text-gray-900">
                                        {moment(selectedApplicant.createdAt)?.format("Do MM YYYY")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() =>
                                handleDownloadResume(selectedApplicant.applicant.resume)
                            }
                        >
                            <Download className="h-4 w-4" />
                            Download Resume
                        </button>
                        {/* Status Dropdown */}
                        <div className="mt-4">
                            <label className="block mb-1 text-sm text-gray-700 font-medium">
                                Change Application Status
                            </label>
                            <select
                                value={currentStatus}
                                onChange={onChangeStatus}
                                disabled={isLoading}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            {isLoading && (
                                <p className="text-xs text-gray-500 mt-1">Updating status...</p>
                            )}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
export default ApplicantProfilePreview