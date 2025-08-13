import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Notification,
  Pagination,
  Spinner,
  Table,
  toast,
} from "components/ui";
import TBody from "components/ui/Table/TBody";
import THead from "components/ui/Table/THead";
import Td from "components/ui/Table/Td";
import Th from "components/ui/Table/Th";
import Tr from "components/ui/Table/Tr";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { PAGESIZE } from "constants/pagination.constant";
import { deleteCategory, getAllCategory, toggleCategoryStatus } from "service/configService";
import { ConfirmDialog } from "components/shared";
import CategoriesForm from "./CategoriesForm";
import DataNoFound from "assets/svg/dataNoFound";
import { useSelector } from "react-redux";

const columns = [
  {
    _id: 1,
    name: "Category Name",
  },

  // {
  //   _id: 2,
  //   name: 'Status',
  // },

  {
    _id: 2,
    name: "Action",
  },
];
const CategoriesList = ({flag,setFlag}) => {
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [resultTitle, setResultTitle] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: PAGESIZE,
  });
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

useEffect(() => {
  if (flag) {
    getCategoryData();  
    setFlag(false);     
  }
}, [flag]);

  const getCategoryData = async () => {
    setLoading(true);
    try {
      const payload = {
        perPage: pagination.perPage,
        pageNo: pagination?.currentPage,
      };

      const resp = await getAllCategory(
        "status",
        payload?.pageNo,
        payload?.perPage
      );
      if (resp?.success) {
        setCategoryData(resp?.data);
        setPagination({
          ...pagination,
          currentPage: resp.pagination?.pageNo,
          total: resp.pagination?.count,
        });
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flag) {
      setFlag(false);
      getCategoryData();
    }
  }, [flag]);

  const onDelete = async () => {
    try {
      const resp = await deleteCategory(selectedData?._id);

      if (resp?.success) {
        toast.push(
          <Notification
            title={resp.message}
            type="success"
            duration={1500}
          ></Notification>,
          {
            placement: "top-center",
          }
        );
      }
    } catch (err) {
      console.log("err", err);
      toast.push(
        <Notification
          title={
            err?.response?.data?.error?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.message
          }
          type="danger"
          duration={1500}
        ></Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setFlag(true);
      setIsDeleteOpen(false);
    }
  };

  const onToggleStatus = async () => {
    try {
      const resp = await toggleCategoryStatus(selectedData?._id);

      if (resp?.success) {
        toast.push(
          <Notification
            title={resp.message}
            type="success"
            duration={1500}
          ></Notification>,
          {
            placement: "top-center",
          }
        );
      }
    } catch (err) {
      console.log("err", err);
      toast.push(
        <Notification
          title={
            err?.response?.data?.error?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.message
          }
          type="danger"
          duration={1500}
        ></Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setFlag(true);
      setIsToggleStatusOpen(false);
    }
  };

const handlePageChange = (page) => {
  setPagination((prev) => ({
    ...prev,
    currentPage: page,
  }));
  setFlag(true);  
};


  useEffect(() => {
    if (!pagination?.total) {
      setResultTitle("Result 0 - 0 of 0");
      return;
    }

    const start = (pagination.currentPage - 1) * pagination.perPage + 1;
    const end = start + categoryData.length - 1;
    const total = pagination.total;

    setResultTitle(
      `Result ${pagination.currentPage} - ${categoryData.length} of ${total}`
    );
  }, [pagination, categoryData]);
  return (
    <>
      <div className="flex col-start-1 col-end-3 gap-2 mb-4">
        <div
          className={`w-auto  text-center rounded-lg font-bold bg-${themeColor}-50 text-${themeColor}-${primaryColorLevel} text-base
                              dark:bg-gray-700 px-4 border border-${themeColor}-${primaryColorLevel} py-2 px-2`}
        >
          {resultTitle}
        </div>
      </div>
      <Card bordered className="mb-4">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Spinner />
          </div>
        ) : categoryData?.length > 0 ? (
          <Table>
            <THead>
              <Tr>
                {columns.map((item) => {
                  return (
                    <Th key={item._id}>
                      <span>{item.name}</span>
                    </Th>
                  );
                })}
              </Tr>
            </THead>

            <TBody>
              {categoryData?.map((item, index) => {
                return (
                  <Tr
                    key={item?.id}
                    className={index % 2 !== 0 ? "bg-blue-50" : "bg-white"}
                  >
                    <Td>{item.categoryName}</Td>
                    {/* <Td>
                      <div className="flex justify-start ">
                        {item?.active ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500" />
                            <span
                              className={`capitalize font-semibold text-emerald-500 `}
                            >
                              Active
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-500" />
                            <span
                              className={`capitalize font-semibold text-red-500`}
                            >
                              Inactive
                            </span>
                          </div>
                        )}
                        <span
                          onClick={() => {
                            setSelectedData(item);
                            setIsToggleStatusOpen(true);
                          }}
                          className={`cursor-pointer p-2 hover:text-blue-500`}
                        >
                          <HiOutlineRefresh />
                        </span>
                      </div>
                    </Td> */}

                    <Td>
                      <div className="flex space-x-2 text-lg">
                        <Button
                          className={`cursor-pointer p-2 hover:text-blue-500`}
                          shape="circle"
                          variant="solid"
                          icon={<HiOutlinePencil />}
                          size="sm"
                          onClick={() => {
                            setSelectedData(item);
                            setIsEditModalOpen(true);
                          }}
                        ></Button>
                        <Button
                          className={`cursor-pointer p-2 hover:text-blue-500`}
                          shape="circle"
                          variant="solid"
                          icon={<HiOutlineTrash />}
                          size="sm"
                          onClick={() => {
                            setSelectedData(item);
                            setIsDeleteOpen(true);
                          }}
                        ></Button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        ) : (
          <>
            <DataNoFound />
          </>
        )}
        <div className="flex items-center justify-center mt-8">
          <Pagination
            pageSize={pagination.perPage}
            currentPage={pagination.currentPage}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </div>

        <>
          <CategoriesForm
            data={selectedData}
            type="edit"
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            setFlag={setFlag}
          />
        </>
        <>
          <ConfirmDialog
            isOpen={isToggleStatusOpen}
            onClose={() => setIsToggleStatusOpen(false)}
            onRequestClose={() => setIsToggleStatusOpen(false)}
            type="danger"
            title={`${selectedData?.active ? "Remove" : "Restore"} ${
              selectedData?.categoryName
            }`}
            onCancel={() => setIsToggleStatusOpen(false)}
            onConfirm={onToggleStatus}
            confirmButtonColor="red-600"
          >
            <p>
              Are you sure you want to{" "}
              {selectedData?.active ? "remove" : "restore"} this category.
            </p>
          </ConfirmDialog>
        </>
        <>
          <ConfirmDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onRequestClose={() => setIsDeleteOpen(false)}
            type="danger"
            title={`Delete ${selectedData?.categoryName} Permanently ?`}
            onCancel={() => setIsDeleteOpen(false)}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
          >
            <p>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
          </ConfirmDialog>
        </>
      </Card>
    </>
  );
};

export default CategoriesList;
