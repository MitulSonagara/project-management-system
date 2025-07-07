import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProjects } from '../../redux/Slices/user/projectSlice'
import ProjectCard from '../../components/user/ProjectCard'


export const Projects = () => {
  const dispatch = useDispatch()

  const projectsList = useSelector((state) => state.userProject.projectsList)

  const isSidebarCollapsed = useSelector(
    (state) => state.global.isSidebarCollapsed
  );

  useEffect(() => {
    dispatch(getAllProjects())
  }, []);

  return (
    <div className="p-6">
      <div className={`grid ${isSidebarCollapsed ? "grid-cols-4" : "grid-cols-3"} gap-8`}>

        {projectsList.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}

      </div>
    </div>
  )
}
