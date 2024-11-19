import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useLocation } from "react-router-dom";
import "./ProfileAdminSite.css";
import Sidebar from "../../DiepThanh/SideBar/Sidebar";
import commonAPI from "../../CommonAPI/commonAPI";
export default function PersonalProfile() {
  const [accountInfor, setaccountInfor] = useState({
    id: 6,
    dia_chi: "Tan Luoc Binh Tan Vinh Long",
    email: "qn69962@gmail.com",
    gioi_tinh: "Nam",
    ho_ten: "Nguyen Quoc",
    password: "********",
    role: "customer",
    sdt: "0787804197",
    username: "boydibo123",
    otp: "029345",
    otp_expiry_date: "25/02/2025",
  });

  const path = useLocation().pathname;
  // const getUserAccount = async () => {
  //   try {
  //     // let data = {};
  //     // if (path.includes("/admin")) {
  //     //   data = await commonAPI.get("admin/profile");
  //     // } else if (path.includes("/tourguide")) {
  //     //   data = await commonAPI.get("tourguide/profile");
  //     // }
  //     console.log("FUNCTION GET USER ACCOUNT");
  //     const data = await commonAPI.get("/account");
  //     setaccountInfor(data);
  //     console.log("getUserAccount DATA API METHOD GET:", data);
  //   } catch (error) {
  //     console.log("ERROR getUserAccount LINE 45: ", error);
  //   }
  // };
  useEffect(() => {
    async function getUserAccount() {
      try {
        console.log("FUNCTION GET USER ACCOUNT");
        const data = await commonAPI.get("/account");
        setaccountInfor(data);
        console.log("getUserAccount DATA API METHOD GET:", data);
      } catch (error) {
        console.log("ERROR getUserAccount LINE 45: ", error);
      }
    }
    getUserAccount();
    console.log("USE EFFECT GET USER ACCOUNT");
  }, []);
  return (
    <div style={{ background: "rgb(15 30 45)" }} className={` row mx-0 vh-100`}>
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="col-10">
        <section
          className=""
          style={{
            backgroundColor: "#f4f5f7",
            width: 820,
            margin: "auto",
            marginTop: 60,
          }}
        >
          <MDBContainer className="py-5 w-100 h-100">
            <MDBRow className="justify-content-center align-items-center">
              <MDBCol className="mb-4 mb-lg-0">
                <MDBCard className="mb-3" style={{ borderRadius: ".5rem" }}>
                  <MDBRow className="g-0">
                    <MDBCol
                      md="4"
                      className="gradient-custom text-center text-white"
                      style={{
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: ".5rem",
                      }}
                    >
                      <MDBCardImage
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScv9MaprqD3ckrczoBu4Pgw4Lhtd9GIcxfEw&s"
                        alt="Avatar"
                        className="my-5 rounded-5"
                        style={{ width: "80px" }}
                        fluid
                      />
                      <MDBTypography tag="h5">
                        {accountInfor.ho_ten}
                      </MDBTypography>
                      <MDBIcon far icon="edit mb-5" />
                    </MDBCol>
                    <MDBCol md="8">
                      <MDBCardBody className="p-4">
                        <MDBTypography tag="h6">Information</MDBTypography>
                        <hr className="mt-0 mb-4" />
                        <MDBRow className="pt-1">
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">Email</MDBTypography>
                            <MDBCardText className="text-muted">
                              {accountInfor.email}
                            </MDBCardText>
                          </MDBCol>
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">Phone</MDBTypography>
                            <MDBCardText className="text-muted">
                              {accountInfor.sdt}
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>

                        <MDBTypography tag="h6">Account</MDBTypography>
                        <hr className="mt-0 mb-4" />
                        <MDBRow className="pt-1">
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">UserName</MDBTypography>
                            <MDBCardText className="text-muted">
                              {accountInfor.username}
                            </MDBCardText>
                          </MDBCol>
                          <MDBCol size="6" className="mb-3">
                            <MDBTypography tag="h6">Password</MDBTypography>
                            <MDBCardText className="text-muted">
                              {accountInfor.password}
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>

                        <div className="d-flex justify-content-start">
                          <a href="#!">
                            <MDBIcon fab icon="facebook me-3" size="lg" />
                          </a>
                          <a href="#!">
                            <MDBIcon fab icon="twitter me-3" size="lg" />
                          </a>
                          <a href="#!">
                            <MDBIcon fab icon="instagram me-3" size="lg" />
                          </a>
                        </div>
                      </MDBCardBody>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </div>
    </div>
  );
}
