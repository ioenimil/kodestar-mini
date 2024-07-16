import FileIcon from "./FileIcon";

const ProjectList = ({
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  projects,
}: any) => {
  console.log("projects", projects);
  return (
    <div className=" h-[480px] overflow-y-scroll">
      <div className=" space-y-0 mt-2 ">
        {projects.map((project: any, index: number) => (
          <button
            key={index}
            className="p-3 text-gray-400   bg-opacity-20 cursor-pointer flex  gap-3 flex-col border-b border-opacity-20 border-white hover:bg-gray-100 hover:bg-opacity-20 w-full"
          >
            <div className="flex gap-3">
              <FileIcon extenstion={"html"} size="large" />
              <h2>{project.name}</h2>
            </div>
            <span className="self-end text-[11px] text-stone-500 ">
              Last accessed: {project.lastModified}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
