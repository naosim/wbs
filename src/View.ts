import { TitleOnlyTask, ManagedTask } from './domain/task';
import { TaskSummaryRepository, Links, DateInTask } from './domain/TaskSummary';
import { TaskId } from './domain/TaskId';
import { Note, TaskNoteRepository } from './domain/TaskNote';
import { TaskTreeRepository } from './domain/TaskTree';
import { TaskListFactory } from './service/TaskListFactory';
import { TitleOnlyToMangedService } from './service/TitleOnlyToMangedService';
import { UpdateNoteBodyService } from './service/UpdateNoteBodyService';
import { CreateEmptyNoteService } from './service/CreateEmptyNoteService';
import { MilestoneFactory } from './infra/tasksummary/MilestoneFactory';
import { Services, Vue, config, EditingText } from './index';
export class View {
  static setup(taskSummaryRepository: TaskSummaryRepository, taskNoteRepository: TaskNoteRepository, taskTreeRepository: TaskTreeRepository, now: Date) {
    var taskListFactory = new TaskListFactory(taskSummaryRepository, taskNoteRepository, taskTreeRepository, now);
    var tasks = taskListFactory.create().map(v => {
      if (!v.isManaged) {
        return v;
      }
      v = v as ManagedTask;
      var obj = v as any; // vue用に変更
      obj.editingMilestonesText = v.summary.milestones.list.map(v => `${v.dateText} ${v.title}`).join('\n');
      (v as any).isEditingMilestones = false;
      return obj;
    });
    var callbackToReload = (err?) => {
      if (err)
        throw err;
      app.reload();
    };
    var services = new Services(new TitleOnlyToMangedService(taskSummaryRepository, taskTreeRepository), new UpdateNoteBodyService(taskNoteRepository), new CreateEmptyNoteService(taskNoteRepository, now));
    var app = new Vue({
      el: '#app',
      data: {
        message: 'Hello Vue!',
        list: [] /*tasks*/,
        rootBody: '' /*taskTreeRepository.getTaskRootBody()*/,
        filter: '',
        owner: config.owner,
        repo: config.repo,
        issueUrlPrefix: `https://github.com/${config.owner}/${config.repo}/issues`,
        filterCheckbox: {
          'title': { label: '件名', checked: true },
          'assgin': { label: '担当', checked: true },
          'body': { label: '内容', checked: true },
          'milestone': { label: 'マイルストーン', checked: true },
          'latestnote': { label: '最新状況', checked: true }
        }
      },
      computed: {
        decoratedList: function () {
          console.log('decoratedList');
          var result = this.list;
          var fitlerTargetMap = {
            'title': v => v.title.indexOf(this.filter) != -1,
            'assgin': v => v.isManaged && v.summary.assign.indexOf(this.filter) != -1,
            'body': v => v.isManaged && v.summary.description.indexOf(this.filter) != -1,
            'milestone': v => v.isManaged && v.summary.milestones.contains(this.filter),
            'latestnote': v => v.isManaged && v.latestNoteText.indexOf(this.filter) != -1
          };
          result = result.map(v => {
            v.isHilight = false;
            console.log(v.summary);
            if (this.filter.trim().length == 0) {
              v.isHilight = false;
            }
            else if (Object.keys(fitlerTargetMap).filter(key => this.filterCheckbox[key].checked).some(key => fitlerTargetMap[key](v))) {
              v.isHilight = true;
            }
            v.isEditingMilestones = false;
            return v;
          });
          return result;
        }
      },
      methods: {
        reload: function () {
          this.list = taskListFactory.create().map(v => {
            if (!v.isManaged) {
              return v;
            }
            v = v as ManagedTask;
            var obj = v as any; // vue用に変更
            var editingText: EditingText = {
              milestones: v.summary.milestones.list.map(v => `${v.dateText} ${v.title}`).join('\n'),
              isEditingMilestones: false,
              assign: v.summary.assign,
              isEditingAssign: false,
              goal: v.summary.goal,
              isEditingGoal: false,
              completeDateText: v.summary.completeDate ? v.summary.completeDate.text : '',
              isEditingCompleteDateText: false,
              linksText: v.summary.links.text,
              isEditingLinksText: false,
            };
            obj.editingText = editingText;
            return obj;
          });
          console.log(this.list);
          this.rootBody = taskTreeRepository.getTaskRootBody();
        },
        onPressedRootBodyEdit: function () {
          taskTreeRepository.updateTaskRootBody(this.rootBody, callbackToReload);
        },
        br(text) {
          return text.split('\n').join('<br>');
        },
        createTask(titleOnlyTask: TitleOnlyTask) {
          services.titleOnlyToMangedService.convert(titleOnlyTask, callbackToReload);
        },
        editNote(note: Note, selector) {
          var body = document.querySelector(selector).value.trim();
          services.updateNoteBodyService.update(note, body, callbackToReload);
        },
        createNote(taskId: TaskId) {
          services.createEmptyNoteService.create(taskId, callbackToReload);
        },
        updateSummary(obj) {
          console.log(obj);
          var editingText: EditingText = obj.editingText;
          var summary = taskSummaryRepository
            .getSummary(obj.taskId as TaskId, now)
            .updateMilestones(MilestoneFactory.createMilestones(editingText.milestones, now))
            .updateAssign(editingText.assign)
            .updateGoal(editingText.goal)
            .updateCompleteDate(DateInTask.create(editingText.completeDateText, now))
            .updateLinks(Links.create(editingText.linksText));
          taskSummaryRepository.update(summary, callbackToReload);
        }
      }
    });
    app.reload();
  }
}
