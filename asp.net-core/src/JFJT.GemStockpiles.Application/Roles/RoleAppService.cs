﻿using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Abp.Extensions;
using Abp.Authorization;
using Abp.Linq.Extensions;
using Abp.IdentityFramework;
using Abp.Domain.Repositories;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using JFJT.GemStockpiles.Roles.Dto;
using JFJT.GemStockpiles.Commons.Dto;
using JFJT.GemStockpiles.Authorization;
using JFJT.GemStockpiles.Authorization.Roles;
using JFJT.GemStockpiles.Authorization.Users;

namespace JFJT.GemStockpiles.Roles
{
    [AbpAuthorize(PermissionNames.Pages_SystemManagement_Roles)]
    public class RoleAppService : AsyncCrudAppService<Role, RoleDto, int, PagedResultRequestExtendDto, CreateRoleDto, RoleDto>, IRoleAppService
    {
        private readonly RoleManager _roleManager;
        private readonly UserManager _userManager;

        public RoleAppService(IRepository<Role> repository, RoleManager roleManager, UserManager userManager)
            : base(repository)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        /// <summary>
        /// 添加角色
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.Pages_SystemManagement_Roles_Create)]
        public override async Task<RoleDto> Create(CreateRoleDto input)
        {
            CheckCreatePermission();

            var role = ObjectMapper.Map<Role>(input);
            role.SetNormalizedName();

            CheckErrors(await _roleManager.CreateAsync(role));

            var grantedPermissions = PermissionManager
                .GetAllPermissions()
                .Where(p => input.Permissions.Contains(p.Name))
                .ToList();

            await _roleManager.SetGrantedPermissionsAsync(role, grantedPermissions);

            return MapToEntityDto(role);
        }

        /// <summary>
        /// 修改角色
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.Pages_SystemManagement_Roles_Edit)]
        public override async Task<RoleDto> Update(RoleDto input)
        {
            CheckUpdatePermission();

            var role = await _roleManager.GetRoleByIdAsync(input.Id);

            ObjectMapper.Map(input, role);

            CheckErrors(await _roleManager.UpdateAsync(role));

            var grantedPermissions = PermissionManager
                .GetAllPermissions()
                .Where(p => input.Permissions.Contains(p.Name))
                .ToList();

            await _roleManager.SetGrantedPermissionsAsync(role, grantedPermissions);

            return MapToEntityDto(role);
        }

        /// <summary>
        /// 删除角色
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.Pages_SystemManagement_Roles_Delete)]
        public override async Task Delete(EntityDto<int> input)
        {
            CheckDeletePermission();

            var role = await _roleManager.FindByIdAsync(input.Id.ToString());
            var users = await _userManager.GetUsersInRoleAsync(role.NormalizedName);

            foreach (var user in users)
            {
                CheckErrors(await _userManager.RemoveFromRoleAsync(user, role.NormalizedName));
            }

            CheckErrors(await _roleManager.DeleteAsync(role));
        }

        /// <summary>
        /// 根据ID获取编辑角色信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<RoleDto> GetRoleForEdit(int id)
        {
            var role = await _roleManager.GetRoleByIdAsync(id);
            //获取有效权限项
            var grantedPermissions = (await _roleManager.GetGrantedPermissionsAsync(role)).ToArray();

            RoleDto editRoleDto = ObjectMapper.Map<RoleDto>(role);
            //更新实体权限
            editRoleDto.Permissions = grantedPermissions.Select(t => t.Name).ToList();

            return editRoleDto;
        }

        /// <summary>
        /// 获取权限列表数据
        /// </summary>
        /// <returns></returns>
        public Task<ListResultDto<PermissionDto>> GetAllPermissions()
        {
            var permissions = PermissionManager.GetAllPermissions();

            return Task.FromResult(new ListResultDto<PermissionDto>(
                ObjectMapper.Map<List<PermissionDto>>(permissions)
            ));
        }

        /// <summary>
        /// 获取权限树形结构数据
        /// </summary>
        /// <returns></returns>
        public Task<ListResultDto<PermissionTreeDto>> GetTreePermissions()
        {
            List<PermissionTreeDto> treeList = new List<PermissionTreeDto>();

            var permissions = PermissionManager.GetAllPermissions();
            //
            var treeData = new ListResultDto<FlatPermissionDto>(ObjectMapper.Map<List<FlatPermissionDto>>(permissions));

            if (treeData != null)
            {
                treeList = GetPermissionTreeStruct(treeData, null, 0);
            }

            return Task.FromResult(new ListResultDto<PermissionTreeDto>(ObjectMapper.Map<List<PermissionTreeDto>>(treeList)));
        }

        /// <summary>
        /// 递归生成权限树形结构数据
        /// </summary>
        /// <param name="permissionData"></param>
        /// <param name="parentName"></param>
        /// <param name="parentLevel"></param>
        /// <returns></returns>
        protected List<PermissionTreeDto> GetPermissionTreeStruct(ListResultDto<FlatPermissionDto> permissionData, string parentName, int parentLevel)
        {
            List<PermissionTreeDto> treeList = new List<PermissionTreeDto>();

            var level = parentLevel + 1;
            var treeData = permissionData.Items.Where(b => b.ParentName == parentName).ToList();

            foreach (var item in treeData)
            {
                var children = GetPermissionTreeStruct(permissionData, item.Name, level);

                var model = new PermissionTreeDto() { title = item.DisplayName, name = item.Name, level = level };
                model.children = children.Count <= 0 ? null : children;
                model.expand = level <= 2 ? true : false;

                treeList.Add(model);
            }

            return treeList;
        }

        /// <summary>
        /// 根据ID获取Entity模型
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        protected override async Task<Role> GetEntityByIdAsync(int id)
        {
            return await Repository.GetAllIncluding(x => x.Permissions).FirstOrDefaultAsync(x => x.Id == id);
        }

        /// <summary>
        /// GetAll查询过滤条件
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        protected override IQueryable<Role> CreateFilteredQuery(PagedResultRequestExtendDto input)
        {
            return Repository.GetAllIncluding(x => x.Permissions).WhereIf(!input.KeyWord.IsNullOrWhiteSpace(), x => x.Name.Contains(input.KeyWord) || x.DisplayName.Contains(input.KeyWord));
        }

        /// <summary>
        /// GetAll查询排序条件
        /// </summary>
        /// <param name="query"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        protected override IQueryable<Role> ApplySorting(IQueryable<Role> query, PagedResultRequestExtendDto input)
        {
            return query.OrderBy(r => r.DisplayName);
        }

        /// <summary>
        /// 异常描述本地化转换函数
        /// </summary>
        /// <param name="identityResult"></param>
        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
