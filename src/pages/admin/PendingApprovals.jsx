import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import {
  PendingMaterialsTable,
  PendingUsersTable,
} from "../../components/admin/ApprovalTables.jsx";
import { AdminPageHeader, AdminTabButton } from "../../components/admin/AdminUi.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  approveMaterial,
  approveUser,
  getPendingMaterials,
  getPendingUsers,
  rejectMaterial,
  rejectUser,
} from "../../services/api.js";

export default function PendingApprovals() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => {
    document.title = "GoLibrary | Pending Approvals";
  }, []);

  useEffect(() => {
    let active = true;

    getPendingUsers(token)
      .then((data) => {
        if (active) setPendingUsers(data);
      })
      .catch((error) => {
        if (active) toast.error(error.message || "Unable to load pending users.");
      })
      .finally(() => {
        if (active) setLoadingUsers(false);
      });

    getPendingMaterials(token)
      .then((data) => {
        if (active) setPendingMaterials(data);
      })
      .catch((error) => {
        if (active) toast.error(error.message || "Unable to load pending materials.");
      })
      .finally(() => {
        if (active) setLoadingMaterials(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleApproveUser = async (user) => {
    setBusyId(user.id);
    try {
      await approveUser(user.id, token);
      setPendingUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success(`${user.name} approved successfully.`);
    } catch (error) {
      toast.error(error.message || "Unable to approve user.");
    } finally {
      setBusyId("");
    }
  };

  const handleApproveMaterial = async (material) => {
    setBusyId(material.id);
    try {
      await approveMaterial(material.id, token);
      setPendingMaterials((current) => current.filter((item) => item.id !== material.id));
      toast.success(`"${material.title}" approved successfully.`);
    } catch (error) {
      toast.error(error.message || "Unable to approve material.");
    } finally {
      setBusyId("");
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;

    setBusyId(rejectTarget.id);
    try {
      if (rejectTarget.type === "user") {
        await rejectUser(rejectTarget.item.id, token);
        setPendingUsers((current) =>
          current.filter((item) => item.id !== rejectTarget.item.id),
        );
        toast.success(`${rejectTarget.item.name} rejected successfully.`);
      } else {
        await rejectMaterial(rejectTarget.item.id, token);
        setPendingMaterials((current) =>
          current.filter((item) => item.id !== rejectTarget.item.id),
        );
        toast.success(`"${rejectTarget.item.title}" rejected successfully.`);
      }
    } catch (error) {
      toast.error(error.message || "Unable to process rejection.");
    } finally {
      setBusyId("");
      setRejectTarget(null);
    }
  };

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Pending Approvals"
        description="Review newly registered users and submitted materials waiting for admin action."
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <AdminTabButton active={activeTab === "users"} onClick={() => setActiveTab("users")}>
          Pending Users
        </AdminTabButton>
        <AdminTabButton
          active={activeTab === "materials"}
          onClick={() => setActiveTab("materials")}
        >
          Pending Materials
        </AdminTabButton>
      </div>

      {activeTab === "users" ? (
        <PendingUsersTable
          users={pendingUsers}
          loading={loadingUsers}
          busyId={busyId}
          onApprove={handleApproveUser}
          onReject={(user) => setRejectTarget({ type: "user", item: user, id: user.id })}
          emptyTitle="No pending users"
          emptyDescription="All user registrations have been reviewed."
        />
      ) : (
        <PendingMaterialsTable
          materials={pendingMaterials}
          loading={loadingMaterials}
          busyId={busyId}
          onApprove={handleApproveMaterial}
          onReject={(material) =>
            setRejectTarget({ type: "material", item: material, id: material.id })
          }
        />
      )}

      <ConfirmModal
        open={Boolean(rejectTarget)}
        title={
          rejectTarget?.type === "material" ? "Reject this material?" : "Reject this user?"
        }
        message={
          rejectTarget
            ? rejectTarget.type === "material"
              ? `${rejectTarget.item.title} will be rejected and removed from the pending list.`
              : `${rejectTarget.item.name} will be rejected and removed from the platform.`
            : ""
        }
        confirmLabel={
          rejectTarget?.type === "material" ? "Reject Material" : "Reject User"
        }
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
        danger
      />
    </div>
  );
}
