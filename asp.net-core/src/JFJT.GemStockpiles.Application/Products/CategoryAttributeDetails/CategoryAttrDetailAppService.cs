using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using JFJT.GemStockpiles.Authorization;
using JFJT.GemStockpiles.Models.Products;
using JFJT.GemStockpiles.Products.CategoryAttributeDetails.Dto;

namespace JFJT.GemStockpiles.Products.CategoryAttributeDetails
{
    [AbpAuthorize(PermissionNames.Pages_ProductManagement_CategoryAttributes)]
    public class CategoryAttrDetailAppService: AsyncCrudAppService<CategoryAttributeItem, CategoryAttrDetailDto, Guid, PagedResultRequestDto, CategoryAttrDetailDto, CategoryAttrDetailDto>, ICategoryAttrDetailAppService
    {
        private readonly IRepository<CategoryAttributeItem, Guid> _categoryAttrDetailRepository;

        public CategoryAttrDetailAppService(IRepository<CategoryAttributeItem, Guid> categoryAttrDetailRepository)
         : base(categoryAttrDetailRepository)
        {
            _categoryAttrDetailRepository = categoryAttrDetailRepository;
        }

        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(PermissionNames.Pages_ProductManagement_CategoryAttributes_Create)]
        public override async Task<CategoryAttrDetailDto> Create(CategoryAttrDetailDto input)
        {
            CheckCreatePermission();

            var entity = ObjectMapper.Map<CategoryAttributeItem>(input);

            entity = await _categoryAttrDetailRepository.InsertAsync(entity);

            return MapToEntityDto(entity);
        }

        public Task<ListResultDto<CategoryAttrDetailDto>> GetAttrDetail(Guid Id)
        {
            var entity = _categoryAttrDetailRepository.GetAllList().Where(a=>a.AttributeId==Id);
            return Task.FromResult(new ListResultDto<CategoryAttrDetailDto>(
                ObjectMapper.Map<List<CategoryAttrDetailDto>>(entity)
            ));
        }
    }
}
