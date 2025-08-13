import React from "react";
import BlogList from "./components/ListBlog";
import { Button, Card } from "components/ui";
import useThemeClass from "utils/hooks/useThemeClass";
import { HiPlusCircle } from "react-icons/hi";
import {
  BLOGS_PREFIX_PATH,
  BLOG_ADD_PREFIX_PATH,
} from "constants/route.constant";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const navigateTo = useNavigate();
  const { textTheme } = useThemeClass();

  return (
    <>
      <Card bordered className="mb-4">
        <div>
          <div className="flex items-center justify-between">
            <div className={`text-xl font-bold ${textTheme}`}>Blogs</div>
            <div>
              <Button
                variant="solid"
                block
                size="sm"
                icon={<HiPlusCircle />}
                onClick={() =>
                  navigateTo(`${BLOGS_PREFIX_PATH}${BLOG_ADD_PREFIX_PATH}`)
                }
              >
                Create Blog
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card bordered>
        <BlogList />
      </Card>
    </>
  );
};

export default Blogs;
