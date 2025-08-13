import React, { Suspense } from "react";
import PropTypes from "prop-types";

const PAGE_CONTAINER_GUTTER_X = "px-4 sm:px-6 md:px-8";
const PAGE_CONTAINER_GUTTER_Y = "py-4 sm:py-6 md:px-8";

const PageContainer = (props) => {
  const { children, footer, header } = props;

  return (
    <>
      {/* <div className="top-0 sticky z-50 shadow-lg	">
        {header && <Header />}
      </div> */}
      {/* <div className="h-full flex flex-auto flex-col justify-between ">
        <main className="h-full">
          <div
            className={classNames(
              "page-container relative h-full flex flex-auto flex-col",
              pageContainerType !== "gutterless" &&
                `${PAGE_CONTAINER_GUTTER_X} ${PAGE_CONTAINER_GUTTER_Y}`,
              pageContainerType === "contained" && "container mx-auto"
            )}
          >
            {pageContainerType === "contained" ? (
              <Container className="h-full">
                <>{children}</>
              </Container>
            ) : (
              <>{children}</>
            )}
          </div>
        </main>
      </div> */}
      <div>
        <main className="h-full">{children}</main>
      </div>
      {/* {footer && <Footer />} */}
    </>
  );
};

PageContainer.defaultProps = {
  pageContainerType: "default",
  contained: false,
  footer: true,
};

PageContainer.propTypes = {
  pageContainerType: PropTypes.oneOf(["default", "gutterless", "contained"]),
  header: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  extraHeader: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  contained: PropTypes.bool,
  footer: PropTypes.bool,
};

export default PageContainer;